package org.exampleapps.greatbig.web

import org.exampleapps.greatbig.exception.NotFoundException
import org.exampleapps.greatbig.jwt.ApiKeySecured
import org.exampleapps.greatbig.model.User
import org.exampleapps.greatbig.model.inout.Profile
import org.exampleapps.greatbig.repository.UserRepository
import org.exampleapps.greatbig.service.UserService
import org.springframework.web.bind.annotation.*

@RestController
class ProfileHandler(val userRepository: UserRepository,
                     val userService: UserService) {

    @ApiKeySecured(mandatory = false)
    @GetMapping("/api/profiles/{username}")
    fun profile(@PathVariable username: String): Any {
        userRepository.findByUsername(username)?.let {
            return view(it, userService.currentUser())
        }
        throw NotFoundException()
    }

    @ApiKeySecured
    @PostMapping("/api/profiles/{username}/follow")
    fun follow(@PathVariable username: String): Any {
        userRepository.findByUsername(username)?.let {
            var currentUser = userService.currentUser()
            if (!currentUser.follows.contains(it)) {
                currentUser.follows.add(it)
                currentUser = userService.setCurrentUser(userRepository.save(currentUser))
            }
            return view(it, currentUser)
        }
        throw NotFoundException()
    }

    @ApiKeySecured
    @DeleteMapping("/api/profiles/{username}/follow")
    fun unfollow(@PathVariable username: String): Any {
        userRepository.findByUsername(username)?.let {
            var currentUser = userService.currentUser()
            if (currentUser.follows.contains(it)) {
                currentUser.follows.remove(it)
                currentUser = userService.setCurrentUser(userRepository.save(currentUser))
            }
            return view(it, currentUser)
        }
        throw NotFoundException()
    }

    fun view(user: User, currentUser: User) = mapOf("profile" to Profile.fromUser(user, currentUser))

}
