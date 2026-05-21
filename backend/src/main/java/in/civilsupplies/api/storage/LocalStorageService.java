package in.civilsupplies.api.storage;

import in.civilsupplies.api.config.AppProperties;
import in.civilsupplies.api.exception.ApiException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class LocalStorageService implements StorageService {

    /**
     * Whitelist of file types we accept for BOQ uploads. We probe the actual bytes
     * (via {@link Files#probeContentType}) rather than trust the client-supplied
     * {@code Content-Type}, to prevent .exe/.html being uploaded under a fake type.
     */
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "application/pdf",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv",
            "image/jpeg",
            "image/png"
    );

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "pdf", "xls", "xlsx", "csv", "jpg", "jpeg", "png"
    );

    private final Path root;

    public LocalStorageService(AppProperties props) {
        this.root = Path.of(props.storage().localDir()).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.root);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to create upload dir " + root, e);
        }
    }

    @Override
    public Stored store(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("File is empty.");
        }

        String original = file.getOriginalFilename() == null ? "upload" : file.getOriginalFilename();
        String ext = extensionOf(original).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(ext)) {
            throw ApiException.badRequest("Unsupported file type. Allowed: pdf, xls, xlsx, csv, jpg, png.");
        }

        // Sanitize filename: alphanum/dot/dash/underscore only, prefix with UUID.
        String safe = original.replaceAll("[^A-Za-z0-9._-]", "_");
        String name = UUID.randomUUID() + "_" + safe;

        Path dir = root.resolve(folder).normalize();
        if (!dir.startsWith(root)) {
            throw ApiException.badRequest("Invalid folder.");
        }

        try {
            Files.createDirectories(dir);
            Path target = dir.resolve(name);
            if (!target.normalize().startsWith(root)) {
                throw ApiException.badRequest("Invalid path.");
            }

            try (var in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }

            // Probe content type from the bytes on disk, not the header.
            String detected = Files.probeContentType(target);
            if (detected != null && !ALLOWED_CONTENT_TYPES.contains(detected)) {
                Files.deleteIfExists(target);
                throw ApiException.badRequest(
                        "File content does not match an allowed format (got: " + detected + ").");
            }

            String key = folder + "/" + name;
            return new Stored(original, "/files/" + key, key);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store file", e);
        }
    }

    @Override
    public String resolveUrl(String key) {
        return "/files/" + key;
    }

    private static String extensionOf(String filename) {
        int idx = filename.lastIndexOf('.');
        return (idx >= 0 && idx < filename.length() - 1) ? filename.substring(idx + 1) : "";
    }
}
