package nforne;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class HomeController {

    private final AssetService assetService;

    public HomeController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping("/")
    public String index(Model model) {
        List<AssetDto> mediaList = assetService.getAllAssets();
        model.addAttribute("mediaList", mediaList);
        return "index";
    }

    @GetMapping("/api/assets")
    @ResponseBody
    public List<AssetDto> assetsApi() {
        return assetService.getAllAssets();
    }
}
