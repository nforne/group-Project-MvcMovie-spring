package nforne;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Controller
public class HomeController {

    private final AssetService assetService;

    public HomeController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping("/")
    public String index(Model model) {
        List<AssetDto> all = assetService.getAllAssets();
        List<AssetDto> board2 = assetService.getAssetsForBoard(2);
        List<AssetDto> board3 = assetService.getAssetsForBoard(3);

        Set<String> assigned = Stream.concat(board2.stream(), board3.stream())
                                     .map(AssetDto::getId)
                                     .collect(Collectors.toSet());

        List<AssetDto> board1 = all.stream()
            .filter(a -> !assigned.contains(a.getId()))
            .filter(a -> {
                // hide placeholder (id "3") on board1 unless explicitly corrupted
                if ("3".equals(a.getId())) {
                    return a.isCorrupted();
                }
                return true;
            })
            .collect(Collectors.toList());

        model.addAttribute("board1List", board1);
        model.addAttribute("board2List", board2);
        model.addAttribute("board3List", board3);
        return "index";
    }

    @GetMapping("/api/assets")
    @ResponseBody
    public List<AssetDto> assetsApi() {
        return assetService.getAllAssets();
    }
}
