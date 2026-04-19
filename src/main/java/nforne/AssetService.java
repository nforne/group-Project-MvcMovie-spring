package nforne;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetService {

    public List<AssetDto> getAllAssets() {
        return List.of(
            new AssetDto(
                "1",
                "Poster 1",
                "https://cfg-j.s3.amazonaws.com/db-bb/avatars/4683640890029216.jpg",
                "https://cfg-j.s3.amazonaws.com/db-bb/media/4476211489374508.mp4",
                "Poster 1"
            ),
            new AssetDto(
                "2",
                "Poster 2",
                "https://cfg-j.s3.amazonaws.com/db-bb/avatars/2595614786669819.png",
                "https://cfg-j.s3.amazonaws.com/db-bb/media/4476211489374508.mp4",
                "Poster 2"
            ),
            new AssetDto(
                "3",
                "Placeholder Poster",
                "/images/poster1-placeholder.svg",
                null,
                "Placeholder poster"
            )
        );
    }

    public AssetDto getById(String id) {
        return getAllAssets().stream()
            .filter(a -> a.getId().equals(id))
            .findFirst()
            .orElse(null);
    }
}

