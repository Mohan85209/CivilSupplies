package in.civilsupplies.api.enquiry;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class EnquiryControllerIT {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;

    @Test
    void submitEnquiry_returns201() throws Exception {
        var payload = Map.of(
                "name", "Anitha Sharma",
                "phone", "9876543210",
                "email", "anitha@example.com",
                "city", "Hyderabad",
                "projectType", "Residential",
                "materials", List.of("Cement"),
                "quantity", "20 bags",
                "message", "Need cement for villa foundation."
        );
        mvc.perform(post("/api/enquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(payload)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.status").value("NEW"))
                .andExpect(jsonPath("$.email").value("anitha@example.com"));
    }

    @Test
    void submitEnquiry_validationError_returns400() throws Exception {
        var bad = Map.of(
                "name", "",
                "phone", "abc",
                "email", "not-an-email"
        );
        mvc.perform(post("/api/enquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(bad)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors").exists());
    }
}
