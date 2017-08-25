package org.exampleapps.greatbig.domain

import java.time.OffsetDateTime
import javax.persistence.*

@Entity
data class Article(var slug: String = "",
                   var title: String = "",
                   var description: String = "",
                   var body: String = "",
                   @ManyToMany
                   val tagList: MutableList<Tag> = mutableListOf(),
                   var createdAt: OffsetDateTime = OffsetDateTime.now(),
                   var updatedAt: OffsetDateTime = OffsetDateTime.now(),
                   @ManyToMany
                   var favorited: MutableList<Author> = mutableListOf(),
                   @ManyToOne
                   var author: Author = Author(),
                   @Id
                @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
                @SequenceGenerator(name = "sequenceGenerator")
                   var id: Long = 0) {
    fun favoritesCount() = favorited.size
}
