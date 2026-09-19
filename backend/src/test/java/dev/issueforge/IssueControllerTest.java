package dev.issueforge;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.issueforge.issue.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class IssueControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    private IssueRequest sampleRequest() {
        return new IssueRequest(
                "Checkout button freezes",
                "Checkout",
                IssueStatus.OPEN,
                Severity.HIGH,
                Priority.URGENT,
                "QA Engineer",
                "Chrome 131 / Windows 11",
                "The checkout action stops responding after selecting a saved card.",
                "1. Sign in\n2. Add an item\n3. Open checkout\n4. Select saved card\n5. Click Pay"
        );
    }

    @Test
    void supportsIssueCrudAndStats() throws Exception {
        String createdBody = mockMvc.perform(post("/api/issues")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Checkout button freezes"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        IssueResponse created = objectMapper.readValue(createdBody, IssueResponse.class);

        mockMvc.perform(get("/api/issues"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(created.id()));

        mockMvc.perform(get("/api/issues/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.open").value(1));

        IssueRequest updated = new IssueRequest(
                sampleRequest().title(),
                sampleRequest().component(),
                IssueStatus.READY_FOR_TEST,
                sampleRequest().severity(),
                sampleRequest().priority(),
                sampleRequest().reporter(),
                sampleRequest().environment(),
                sampleRequest().description(),
                sampleRequest().reproductionSteps()
        );

        mockMvc.perform(put("/api/issues/" + created.id())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("READY_FOR_TEST"));

        mockMvc.perform(delete("/api/issues/" + created.id()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/issues"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void rejectsBlankRequiredFields() throws Exception {
        String invalid = """
                {
                  "title": "",
                  "component": "",
                  "status": "OPEN",
                  "severity": "MEDIUM",
                  "priority": "MEDIUM",
                  "reporter": "",
                  "environment": "",
                  "description": "",
                  "reproductionSteps": ""
                }
                """;

        mockMvc.perform(post("/api/issues")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalid))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"));
    }
}
