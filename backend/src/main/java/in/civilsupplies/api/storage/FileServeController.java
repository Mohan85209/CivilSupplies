package in.civilsupplies.api.storage;

import in.civilsupplies.api.config.AppProperties;
import in.civilsupplies.api.exception.ApiException;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Path;

@RestController
@RequestMapping("/files")
public class FileServeController {

    private final Path root;

    public FileServeController(AppProperties props) {
        this.root = Path.of(props.storage().localDir()).toAbsolutePath().normalize();
    }

    @GetMapping("/{folder}/{name:.+}")
    public ResponseEntity<Resource> serve(@PathVariable String folder, @PathVariable String name) {
        Path target = root.resolve(folder).resolve(name).normalize();
        if (!target.startsWith(root) || !target.toFile().exists()) {
            throw ApiException.notFound("File");
        }
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + name + "\"")
                .body(new FileSystemResource(target));
    }
}
