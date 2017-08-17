package org.exampleapps.greatbig.service.dto;

import org.exampleapps.greatbig.service.dto.ProfileDTO;
import java.io.Serializable;
import java.util.Objects;
import java.time.ZonedDateTime;
import javax.persistence.*;
// import javax.persistence.Lob;

/**
 * A DTO for the Comment entity.
 *
 * "comment": {
 *   "id": 1,
 *   "createdAt": "2016-02-18T03:22:56.637Z",
 *   "updatedAt": "2016-02-18T03:22:56.637Z",
 *   "body": "It takes a Jacobian",
 *   "author": {
 *     "username": "jake",
 *     "bio": "I work at statefarm",
 *     "image": "https://i.stack.imgur.com/xHWG8.jpg",
 *     "following": false
 *   }
 * }
 *}
 */

class CommentDTOInner implements Serializable {

    @Lob
    private String body;

    public void setBody(String body) {
        this.body = body;
    }

    public String getBody() {
        return body;
    }

    @Override
    public String toString() {
        return "comment: {" +
            "body='" + getBody() + "'" +
            "}";
    }

}

public class CommentDTO implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    private CommentDTOInner comment;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setComment(CommentDTOInner comment) {
        this.comment = comment;
    }

    public CommentDTOInner getComment() {
        return comment;
    }

    public String getBody() {
        return comment.getBody();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        CommentDTO commentDTO = (CommentDTO) o;
        if(commentDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), commentDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "comment: {" +
            "id=" + getId() +
            ", comment='" + getComment().toString() + "'" +
            "}";
    }
}
