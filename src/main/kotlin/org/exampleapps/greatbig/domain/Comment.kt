package org.exampleapps.greatbig.domain

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import java.time.OffsetDateTime
import javax.persistence.*

@Entity
@Embeddable
@Table(name = "comment")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "comment")
data class Comment(var createdAt: OffsetDateTime = OffsetDateTime.now(),
                   var updatedAt: OffsetDateTime = OffsetDateTime.now(),
                   var body: String = "",
                   @ManyToOne
                   var article: Article = Article(),
                   @ManyToOne
                   var author: Author = Author(),
                //    @Id @GeneratedValue(strategy = GenerationType.AUTO)
                   @Id
                   @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
                   @SequenceGenerator(name = "sequenceGenerator")
                   var id: Long = 0)
