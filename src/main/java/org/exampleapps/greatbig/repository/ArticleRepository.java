// References
// http://dontpanic.42.nl/2011/06/spring-data-jpa-with-querydsl.html

package org.exampleapps.greatbig.repository;

import org.exampleapps.greatbig.domain.Article;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;
import javax.persistence.EntityManager;

/**
 * Spring Data JPA repository for the Article entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    // Since moving the relationship from User to Author (with no login field) this doesn't work.
    // Luckily it isn't needed yet.
    // @Query("select article from Article article where article.author.login = ?#{principal.username}")
    // List<Article> findByAuthorIsCurrentUser();

    @Query("select distinct article from Article article left join fetch article.tags")
    List<Article> findAllWithEagerRelationships();

    @Query("select article from Article article left join fetch article.tags where article.id = :id")
    Article findOneWithEagerRelationships(@Param("id") Long id);

    @Query("select article from Article article left join fetch article.tags where article.id = :id")
    Article findOneByIdWithEagerRelationships(@Param("id") Long id);

    @Query("select article from Article article left join fetch article.tags where article.slug = :slug")
    Article findOneBySlugWithEagerRelationships(@Param("slug") String slug);

    @Query("select article from Article article where article.slug = :slug")
    Article findOneBySlug(@Param("slug") String slug);

    @Query("select article from Article article inner join article.author author inner join author.user user where user.login = :author")
    Page<Article> findByAuthor(@Param("author") String author, Pageable pageable);

    @Query("select article from " +
           "   Article article inner join article.author " +
           "   author inner join author.followers " +
           "   followers inner join followers.user user " +
           "   where user.login = :login")
    Page<Article> findByFollowed(@Param("login") String login, Pageable pageable);

    @Query("select article from Article article left join article.tags tags where tags.name = :tag")
    Page<Article> findByTag(@Param("tag") String tag, Pageable pageable);

    @Query("select distinct article from Article article left join article.favoriters favoriters where favoriters.id =:id")
    Page<Article> findByFavoriter(@Param("id") Long id, Pageable pageable);

    @Query("select article from Article article")
    Page<Article> findAll(Pageable pageable);

}
