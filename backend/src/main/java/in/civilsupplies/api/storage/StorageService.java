package in.civilsupplies.api.storage;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    Stored store(MultipartFile file, String folder);
    String resolveUrl(String key);
    record Stored(String filename, String url, String key) {}
}
