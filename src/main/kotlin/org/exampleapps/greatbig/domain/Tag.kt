package org.exampleapps.greatbig.domain

import com.fasterxml.jackson.annotation.JsonIgnore
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.*

@Entity
data class Tag(val name: String = "",
               @Id @GeneratedValue(strategy = GenerationType.AUTO)
               @JsonIgnore
               var id: Long = 0)