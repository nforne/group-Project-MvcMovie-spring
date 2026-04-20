package nforne;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(HomeController.class)
class HomeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // Mock every dependency that HomeController autowires or requires
    @Mock
    private AssetService movieService;   // replace with the actual service type(s) used by HomeController

    @Test
    void indexReturnsIndexView() throws Exception {
        // if controller calls movieService.findAll(), stub it:
        // when(movieService.findAll()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/"))
               .andExpect(status().isOk())
               .andExpect(view().name("index"));
    }
}
