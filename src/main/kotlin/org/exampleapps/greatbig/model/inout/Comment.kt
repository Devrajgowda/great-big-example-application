package org.exampleapps.greatbig.model.inout

import com.fasterxml.jackson.annotation.JsonRootName
import org.exampleapps.greatbig.model.User
import java.time.OffsetDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@JsonRootName("comment")
data class Comment(val createdAt: String,
                   val updatedAt: String,
                   val body: String,
                   val author: Profile,
                   val id: Long) {
    companion object {
        fun dateFormat(date: OffsetDateTime): String {
            return date.toZonedDateTime().withZoneSameInstant(ZoneId.of("Z")).format(DateTimeFormatter.ISO_ZONED_DATE_TIME)
        }

        fun fromModel(model: org.exampleapps.greatbig.model.Comment, currentUser: User): Comment {
            return Comment(
                    id = model.id,
                    body = model.body,
                    createdAt = dateFormat(model.createdAt),
                    updatedAt = dateFormat(model.updatedAt),
                    author = Profile.fromUser(model.author, currentUser)
            )
        }
    }
}