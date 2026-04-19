package nforne;

public class AssetDto {
    private String id;
    private String title;
    private String posterUrl;
    private String videoUrl;
    private String altText;

    public AssetDto() {}

    public AssetDto(String id, String title, String posterUrl, String videoUrl, String altText) {
        this.id = id;
        this.title = title;
        this.posterUrl = posterUrl;
        this.videoUrl = videoUrl;
        this.altText = altText;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public String getAltText() { return altText; }
    public void setAltText(String altText) { this.altText = altText; }
}
