// AssetService.java (updated assets + board assignments + play-invisible flag)
package nforne;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AssetService {

    private final List<AssetDto> assets;
    private final Map<String, Integer> boardAssignment;

    public AssetService() {
        this.assets = buildAssets();
        this.boardAssignment = buildBoardAssignments();
    }

    private List<AssetDto> buildAssets() {
        return List.of(
            new AssetDto("1", "Poster 1",
                "https://cfg-j.s3.amazonaws.com/db-bb/avatars/4683640890029216.jpg",
                "https://cfg-j.s3.amazonaws.com/db-bb/media/4476211489374508.mp4",
                "Poster 1", false, false),

            new AssetDto("2", "Poster 2",
                "https://cfg-j.s3.amazonaws.com/db-bb/avatars/2595614786669819.png",
                "https://cfg-j.s3.amazonaws.com/db-bb/media/4476211489374508.mp4",
                "Poster 2", false, false),

            // placeholder poster: not corrupted by default (won't show on board1)
            new AssetDto("3", "Placeholder Poster",
                "/images/poster1-placeholder.svg",
                null,
                "Placeholder poster", false, false),

            // audio assets: first audio has playInvisibleOnLaunch = true
            new AssetDto("4", "Ambient Track A",
                "/images/audio-avatar-1.svg",
                "https://cfg-j.s3.us-east-1.amazonaws.com/db-bb/assets/2454061231704100.mp3",
                "Ambient Track A", false, true),

            new AssetDto("5", "Ambient Track B",
                "/images/audio-avatar-2.svg",
                "https://cfg-j.s3.us-east-1.amazonaws.com/db-bb/assets/2454061231704110.mp3",
                "Ambient Track B", false, false),

            new AssetDto("6", "Ambient Track C",
                "/images/audio-avatar-3.svg",
                "https://cfg-j.s3.us-east-1.amazonaws.com/db-bb/assets/2454061231704111.mp3",
                "Ambient Track C", false, false),

            new AssetDto("7", "Ambient Track D",
                "/images/audio-avatar-4.svg",
                "https://cfg-j.s3.us-east-1.amazonaws.com/db-bb/assets/2454061231704113.mp3",
                "Ambient Track D", false, false),

            new AssetDto("8", "Ambient Track E",
                "/images/audio-avatar-5.svg",
                "https://cfg-j.s3.us-east-1.amazonaws.com/db-bb/assets/2454061231704114.mp3",
                "Ambient Track E", false, false)
        );
    }

    private Map<String, Integer> buildBoardAssignments() {
        Map<String, Integer> map = new HashMap<>();
        // assign two audio assets to board 2 and two to board 3
        map.put("5", 2);
        map.put("6", 2);
        map.put("7", 3);
        map.put("8", 3);
        return Collections.unmodifiableMap(map);
    }

    public List<AssetDto> getAllAssets() {
        return assets;
    }

    public AssetDto getById(String id) {
        return assets.stream().filter(a -> a.getId().equals(id)).findFirst().orElse(null);
    }

    public List<AssetDto> getAssetsForBoard(int boardNumber) {
        Set<String> ids = boardAssignment.entrySet().stream()
            .filter(e -> e.getValue() == boardNumber)
            .map(Map.Entry::getKey)
            .collect(Collectors.toSet());

        return assets.stream()
            .filter(a -> ids.contains(a.getId()))
            .collect(Collectors.toList());
    }

    public Map<String, Integer> getBoardAssignments() {
        return boardAssignment;
    }
}
