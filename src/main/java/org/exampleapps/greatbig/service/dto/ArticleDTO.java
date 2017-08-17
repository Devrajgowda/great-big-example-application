package org.exampleapps.greatbig.service.dto;

import org.exampleapps.greatbig.service.dto.ProfileDTO;
import org.exampleapps.greatbig.domain.Article;

import java.io.Serializable;
import java.util.Objects;
import java.time.ZonedDateTime;
import javax.persistence.Lob;

/**
 * A DTO for the Article entity.
 *
 * Posted like this
 * {
 *  "article": {
 *    "title": "How to train your dragon",
 *    "description": "Ever wonder how?",
 *    "body": "You have to believe",
 *    "tagList": ["reactjs", "angularjs", "dragons"]
 *  }
 * }
 *
 * Read like this
 *
 * "article: {
 *   "slug": "how-to-train-your-dragon",
 *   "title": "How to train your dragon",
 *   "description": "Ever wonder how?",
 *   "body": "It takes a Jacobian",
 *   "tagList": ["dragons", "training"],
 *   "createdAt": "2016-02-18T03:22:56.637Z",
 *   "updatedAt": "2016-02-18T03:48:35.824Z",
 *   "favorited": false,
 *   "favoritesCount": 0,
 *   "author": {
 *     "username": "jake",
 *     "bio": "I work at statefarm",
 *     "image": "https://i.stack.imgur.com/xHWG8.jpg",
 *     "following": false
 *   }
 * }
 *
 */
public class ArticleDTO implements Serializable {

    // private Long id;

    private String slug;

    private String title;

    private String description;

    @Lob
    private String body;

    private String[] tagList;

    private ZonedDateTime createdAt;

    private ZonedDateTime updatedAt;

    private Boolean favorited;

    private Integer favoritesCount;

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getTitle() {
        return title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getBody() {
        return body;
    }

    public void setTagList(String[] tagList) {
        this.tagList = tagList;
    }

    public String[] getTagList() {
        return tagList;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setFavorited(Boolean favorited) {
        this.favorited = favorited;
    }

    public Boolean getFavorited() {
        return favorited;
    }

    public void setFavoritesCount(Integer favoritesCount) {
        this.favoritesCount = favoritesCount;
    }

    public Integer getFavoritesCount() {
        return favoritesCount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ArticleDTO articleDTO = (ArticleDTO) o;
        if(articleDTO.getSlug() == null || getSlug() == null) {
            return false;
        }
        return Objects.equals(getSlug(), articleDTO.getSlug());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getSlug());
    }

    @Override
    public String toString() {
        return "article {" +
            "  slug='" + getSlug() + "'" +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", body='" + getBody() + "'" +
            ", tagList='" + (getTagList() == null ? "none" : getTagList()).toString() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            "}";
    }
}
