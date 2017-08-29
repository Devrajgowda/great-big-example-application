package org.exampleapps.greatbig.domain

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import java.time.OffsetDateTime
import javax.persistence.*
import javax.validation.constraints.*;

@Entity
@Table(name = "article")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "article")
data class Article(

    @Column(name = "slug", unique = true, nullable = false)
    var slug: String = "",

    @Column(name = "title", nullable = false)
    var title: String = "",

    @Column(name = "description", nullable = false)
    var description: String = "",

    @Column(name = "jhi_body", nullable = false)
    var body: String = "",

    @ManyToMany
    @JoinTable(name="article_tag")
    val tags: MutableList<Tag> = mutableListOf(),

    @Column(name = "created_at", nullable = false)
    var createdAt: OffsetDateTime = OffsetDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: OffsetDateTime = OffsetDateTime.now(),

    @ManyToMany
    @JoinTable(name="article_favorited")
    var favorited: MutableList<Author> = mutableListOf(),

    @ManyToOne
    var author: Author = Author(),
//  @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    var id: Long = 0

    ) {
        fun favoritesCount() = favorited.size
}
