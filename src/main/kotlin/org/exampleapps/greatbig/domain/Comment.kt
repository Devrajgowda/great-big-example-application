package org.exampleapps.greatbig.domain

import java.time.OffsetDateTime
import javax.persistence.*

@Entity
data class Comment(var createdAt: OffsetDateTime = OffsetDateTime.now(),
                   var updatedAt: OffsetDateTime = OffsetDateTime.now(),
                   var body: String = "",
                   @ManyToOne
                   var article: Article = Article(),
                   @ManyToOne
                   var author: Author = Author(),
                   @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
                   var id: Long = 0)
