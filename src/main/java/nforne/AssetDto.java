// AssetDto.java
package nforne;

public class AssetDto {
    private String id;
    private String title;
    private String posterUrl;
    private String mediaUrl;
    private String altText;
    private boolean corrupted;               // show placeholder only when true
    private boolean playInvisibleOnLaunch;    // hide play control on app launch when true

    public AssetDto(String id, String title, String posterUrl, String mediaUrl, String altText,
                    boolean corrupted, boolean playInvisibleOnLaunch) {
        this.id = id;
        this.title = title;
        this.posterUrl = posterUrl;
        this.mediaUrl = mediaUrl;
        this.altText = altText;
        this.corrupted = corrupted;
        this.playInvisibleOnLaunch = playInvisibleOnLaunch;
    }

    // getters
    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getPosterUrl() { return posterUrl; }
    public String getMediaUrl() { return mediaUrl; }
    public String getAltText() { return altText; }
    public boolean isCorrupted() { return corrupted; }
    public boolean isPlayInvisibleOnLaunch() { return playInvisibleOnLaunch; }

    // setters (if needed)
    public void setCorrupted(boolean corrupted) { this.corrupted = corrupted; }
    public void setPlayInvisibleOnLaunch(boolean playInvisibleOnLaunch) { this.playInvisibleOnLaunch = playInvisibleOnLaunch; }
}
