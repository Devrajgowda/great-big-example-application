// References
// https://github.com/spring-projects/spring-petclinic/blob/master/src/main/java/org/springframework/samples/petclinic/owner/PetController.java

package org.exampleapps.greatbig.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.exampleapps.greatbig.domain.Article;
import org.exampleapps.greatbig.domain.Author;
import org.exampleapps.greatbig.domain.Comment;
import org.exampleapps.greatbig.domain.Tag;
import org.exampleapps.greatbig.domain.User;

import org.exampleapps.greatbig.service.ProfileService;
import org.exampleapps.greatbig.service.dto.ArticleDTO;
import org.exampleapps.greatbig.service.dto.CommentDTO;
import org.exampleapps.greatbig.repository.ArticleRepository;
import org.exampleapps.greatbig.repository.AuthorRepository;
import org.exampleapps.greatbig.repository.CommentRepository;
import org.exampleapps.greatbig.repository.TagRepository;
import org.exampleapps.greatbig.repository.UserRepository;
import org.exampleapps.greatbig.repository.search.ArticleSearchRepository;
import org.exampleapps.greatbig.repository.search.AuthorSearchRepository;
import org.exampleapps.greatbig.repository.search.CommentSearchRepository;
import org.exampleapps.greatbig.repository.search.TagSearchRepository;
import org.exampleapps.greatbig.repository.search.AuthorSearchRepository;
import org.exampleapps.greatbig.security.SecurityUtils;
import org.exampleapps.greatbig.web.rest.util.HeaderUtil;
import org.exampleapps.greatbig.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.util.MultiValueMap;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.Calendar;
import java.util.Date;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import java.time.ZonedDateTime;

import static org.elasticsearch.index.query.QueryBuilders.*;
/**
 * REST controller for managing Article.
 */
@RestController
@RequestMapping("/api")
public class ArticleResource {

    private final Logger log = LoggerFactory.getLogger(ArticleResource.class);

    private static final String ENTITY_NAME = "article";

    private final ArticleRepository articleRepository;

    private final AuthorRepository authorRepository;

    private final UserRepository userRepository;

    private final TagRepository tagRepository;

    private final CommentRepository commentRepository;

    private final TagSearchRepository tagSearchRepository;

    private final CommentSearchRepository commentSearchRepository;

    private final ArticleSearchRepository articleSearchRepository;

    private final AuthorSearchRepository authorSearchRepository;

    public ArticleResource(ArticleRepository articleRepository,
                           ArticleSearchRepository articleSearchRepository,
                           UserRepository userRepository,
                           TagRepository tagRepository,
                           TagSearchRepository tagSearchRepository,
                           AuthorRepository authorRepository,
                           AuthorSearchRepository authorSearchRepository,
                           CommentRepository commentRepository,
                           CommentSearchRepository commentSearchRepository
                           ) {
        this.articleRepository = articleRepository;
        this.articleSearchRepository = articleSearchRepository;
        this.userRepository = userRepository;
        this.tagRepository = tagRepository;
        this.tagSearchRepository = tagSearchRepository;
        this.authorRepository = authorRepository;
        this.authorSearchRepository = authorSearchRepository;
        this.commentRepository = commentRepository;
        this.commentSearchRepository = commentSearchRepository;
    }

    /**
     * POST  /articles : Create a new article.
     * remove @Valid so createdAt could be omitted
     *
     * @param article the article to create
     * @return the ResponseEntity with status 201 (Created) and with body the new article, or with status 400 (Bad Request) if the article has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */

    @PostMapping("/articles")
    @Timed
    public ResponseEntity<Article> createArticle(@RequestBody ArticleDTO articleDTO) throws URISyntaxException {
        log.debug("REST request to save Article : {}", articleDTO);
        // if (article.getId() != null) {
        //     return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new article cannot already have an ID")).body(null);
        // }
        Article article = new Article();
        Optional<User> currentUser = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin());
        if (currentUser.isPresent()) {
            Author author = authorRepository.findById(currentUser.get().getId());
            if (author == null) {
                author = new Author();
                author.setId(currentUser.get().getId());
                authorRepository.save(author);
            }
            article.setAuthor(author);
            for(int i = 0; i < articleDTO.getTagList().length; i++) {
                String tagName = articleDTO.getTagList()[i];
                Tag tag = tagRepository.findOneByName(tagName);
                if (tag == null) {
                    tag = new Tag();
                    tag.setName(tagName);
                    tagRepository.save(tag);
                    tagSearchRepository.save(tag);
                }
                article.addTag(tag);
            }
            article.setSlug(articleDTO.getTitle().replace(' ', '_').toLowerCase());
            article.setTitle(articleDTO.getTitle());
            article.setDescription(articleDTO.getDescription());
            article.setBody(articleDTO.getBody());
            article.setCreatedAt(ZonedDateTime.now());
            article.setUpdatedAt(ZonedDateTime.now());

            Article result = articleRepository.save(article);
            articleSearchRepository.save(result);
            return ResponseEntity.created(new URI("/api/articles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
        } else {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "nocurrentuser", "No current user")).body(null);
        }

    }

    // @PostMapping("/articles")
    // @Timed
    // public ResponseEntity<Article> createArticle(@RequestBody Article article) throws URISyntaxException {
    //     log.debug("REST request to save Article : {}", article);
    //     if (article.getId() != null) {
    //         return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new article cannot already have an ID")).body(null);
    //     }

    //     // for(int i = 0; i < article.getTagList().length; i++) {
    //     //     String tagName = article.getTagList()[i];
    //     //     Tag tag = tagRepository.findOneByName(tagName);
    //     //     article.addTag(tagRepository.save(tag));
    //     // }

    //     // // search for tags
    //     // article.tagList.stream()
    //     //     .map(Tag::getUserId)
    //     //     .collect(Collectors.toList());

    //     // val tagList = article.tagList.map {
    //     //     tagRepository.findByName(it) ?: tagRepository.save(Tag(name = it))
    //     // }

    //     // val article = Article(slug = slug,
    //     //         author = currentUser, title = newArticle.title!!, description = newArticle.description!!,
    //     //         body = newArticle.body!!, tagList = tagList.toMutableList())

    //     article.setCreatedAt(ZonedDateTime.now());
    //     article.setUpdatedAt(ZonedDateTime.now());
    //     article.setSlug(article.getTitle().replace(' ', '_').toLowerCase());

    //     Article result = articleRepository.save(article);
    //     articleSearchRepository.save(result);
    //     return ResponseEntity.created(new URI("/api/articles/" + result.getId()))
    //         .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
    //         .body(result);
    // }

    /**
     * PUT  /articles : Updates an existing article.
     *
     * @param article the article to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated article,
     * or with status 400 (Bad Request) if the article is not valid,
     * or with status 500 (Internal Server Error) if the article couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/articles")
    @Timed
    public ResponseEntity<Article> updateArticle(@Valid @RequestBody Article article) throws URISyntaxException {
        log.debug("REST request to update Article : {}", article);
        // if (article.getId() == null) {
        //     return createArticle(article);
        // }
        Article result = articleRepository.save(article);
        articleSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, article.getId().toString()))
            .body(result);
    }

    /**
     * GET  /articles : get all the articles.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of articles in body
     */
    @GetMapping("/articles")
    @Timed
    public ResponseEntity<List<Article>> getAllArticles(@ApiParam Pageable pageable, @RequestParam MultiValueMap<String, String> parameters) {
        log.debug("REST request to get a page of Articles");
        Page<Article> page;

        // if(parameters.containsKey("limit")) {
        //     pageable.setLimit(parameters.getFirst("limit"));
        // }
        // if(parameters.containsKey("offset")) {
        //     pageable.setOffset(parameters.getFirst("offset"));
        // }
        if(parameters.containsKey("tag")) {
            page = articleRepository.findByTag(parameters.getFirst("tag"), pageable);

            //
        } else if(parameters.containsKey("author")) {
            page = articleRepository.findByAuthor(parameters.getFirst("author"), pageable);
        } else if(parameters.containsKey("favorited")) {
            String favorited = parameters.getFirst("favorited");
            Long userId = userRepository.findOneByLogin(favorited).get().getId();
            page = articleRepository.findByFavoriter(userId, pageable);
        } else {
            page = articleRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/articles");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /articles/feed : get articles of followed authors
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of articles in body
     */
    @GetMapping("/articles/feed")
    @Timed
    public ResponseEntity<List<Article>> getFeed(@ApiParam Pageable pageable, @RequestParam MultiValueMap<String, String> parameters) {
        log.debug("REST request to get a page of Articles");
        String currentUser = SecurityUtils.getCurrentUserLogin();
        Page<Article> page = articleRepository.findByFollowed(currentUser, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/articles/feed");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    // /**
    //  * GET  /articles/:id : get the "id" article.
    //  *
    //  * @param id the id of the article to retrieve
    //  * @return the ResponseEntity with status 200 (OK) and with body the article, or with status 404 (Not Found)
    //  */
    // @GetMapping("/articles/{id}")
    // @Timed
    // public ResponseEntity<Article> getArticle(@PathVariable Long id) {
    //     log.debug("REST request to get Article : {}", id);
    //     Article article = articleRepository.findOneWithEagerRelationships(id);
    //     return ResponseUtil.wrapOrNotFound(Optional.ofNullable(article));
    // }

    /**
     * GET  /articles/:slug : get the "slug" or "id" article. This app is just a demo. It follows the Real World
     *      API spec that has this parameter be a string. I also want the regular JHipster UI to work for Article
     *      and that has the parameter be an integer. So while the article could theoretically have a title that's
     *      an integer and this would try to return the article with that as the id, that's unlikely and this is
     *      just a demo.
     *
     * @param slug the slug of the article to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the article, or with status 404 (Not Found)
     */
    @GetMapping("/articles/{slug}")
    @Timed
    public ResponseEntity<Article> getArticle(@PathVariable String slug) {
        log.debug("REST request to get Article : {}", slug);
        Article article;
        Long id = longValue(slug);
        if(id > 0) {
            article = articleRepository.findOneByIdWithEagerRelationships(id);
        } else {
            article = articleRepository.findOneBySlugWithEagerRelationships(slug);
        }
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(article));
    }

    private Long longValue( String input ) {
        Long value = 0L;
        try {
            value = Long.parseLong(input, 10);
            return value;
        }
        catch( NumberFormatException e ) {
            return 0L;
        }
    }

    /**
     * DELETE  /articles/:id : delete the "id" article.
     *
     * @param id the id of the article to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/articles/{id}")
    @Timed
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        log.debug("REST request to delete Article : {}", id);
        articleRepository.delete(id);
        articleSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/articles?query=:query : search for the article corresponding
     * to the query.
     *
     * @param query the query of the article search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/articles")
    @Timed
    public ResponseEntity<List<Article>> searchArticles(@RequestParam String query, @ApiParam Pageable pageable) {
        log.debug("REST request to search for a page of Articles for query {}", query);
        Page<Article> page = articleSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/articles");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * POST  /articles/:slug/comments : Add a comment to an Article
     *
     * @param article the article to create
     * @return the ResponseEntity with status 201 (Created) and with body the new article, or with status 400 (Bad Request)
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */

    @Transactional
    @PostMapping("/articles/{slug}/comments")
    @Timed
    public ResponseEntity<Article> addComment(@RequestBody CommentDTO commentDTO, @PathVariable String slug) throws URISyntaxException {
        log.debug("REST request to add Comment : {}", commentDTO);
        // if (article.getId() != null) {
        //     return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new article cannot already have an ID")).body(null);
        // }

        Optional<User> currentUser = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin());
        if (currentUser.isPresent()) {
            Author author = authorRepository.findById(currentUser.get().getId());
            if (author == null) {
                author = new Author();
                author.setId(currentUser.get().getId());
                authorRepository.save(author);
                authorSearchRepository.save(author);
            }

            Comment comment = new Comment();
            comment.setBody(commentDTO.getBody());
            comment.setAuthor(author);
            comment.setCreatedAt(ZonedDateTime.now());
            comment.setUpdatedAt(ZonedDateTime.now());
            Comment savedComment = commentRepository.save(comment);
            commentSearchRepository.save(savedComment);

            Article article = articleRepository.findOneBySlug(slug);
            article.addComment(savedComment);
            Article savedArticle = articleRepository.save(article);
            articleSearchRepository.save(savedArticle);

            return ResponseEntity.created(new URI("/articles/:slug/comments"))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, savedArticle.getId().toString()))
            .body(savedArticle);
        } else {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "nocurrentuser", "No current user")).body(null);
        }

    }

}
