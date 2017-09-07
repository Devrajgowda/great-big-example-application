package org.exampleapps.greatbig.domain

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonRootName
import javax.persistence.*

@Entity
@JsonRootName("author")
data class Author(@Id
                var id: Long = 0,
                var bio: String = "",
                @MapsId
                @OneToOne
                @JoinColumn(name = "id")
	            var user: User = User(),
                @ManyToMany
                @JoinTable(name="author_follower")
                @JsonIgnore
                var followers: MutableList<Author> = mutableListOf()
                ) {
    override fun toString(): String = "Author($id, $bio)"
}
