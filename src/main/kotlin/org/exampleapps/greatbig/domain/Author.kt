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
                // @OneToOne(cascade = CascadeType.ALL)
                @OneToOne
                @JoinColumn(name = "id")
	            var user: User = User(),
                @ManyToMany
                @JsonIgnore
                var follows: MutableList<Author> = mutableListOf()
                ) {
    override fun toString(): String = "Author($id, $bio)"
}
