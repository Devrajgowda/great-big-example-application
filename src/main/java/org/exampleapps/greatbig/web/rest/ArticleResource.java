package org.exampleapps.greatbig.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.exampleapps.greatbig.domain.Article;
import org.exampleapps.greatbig.domain.Tag;

import org.exampleapps.greatbig.service.ProfileService;
import org.exampleapps.greatbig.service.dto.ArticleDTO;
import org.exampleapps.greatbig.repository.ArticleRepository;
import org.exampleapps.greatbig.repository.TagRepository;
import org.exampleapps.greatbig.domain.User;
import org.exampleapps.greatbig.repository.UserRepository;
import org.exampleapps.greatbig.repository.search.ArticleSearchRepository;
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

    private final UserRepository userRepository;

    // private final TagRepository tagRepository;

    private final ArticleSearchRepository articleSearchRepository;

    public ArticleResource(ArticleRepository articleRepository, ArticleSearchRepository articleSearchRepository, UserRepository userRepository) {
        this.articleRepository = articleRepository;
        this.articleSearchRepository = articleSearchRepository;
        this.userRepository = userRepository;
    }

    /**
     * POST  /articles : Create a new article.
     * remove @Valid so createdAt could be omitted
     *
     * @param article the article to create
     * @return the ResponseEntity with status 201 (Created) and with body the new article, or with status 400 (Bad Request) if the article has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */

    // @PostMapping("/articles")
    // @Timed
    // public ResponseEntity<Article> newcreateArticle(@RequestBody ArticleDTO article) throws URISyntaxException {
    //     log.debug("REST request to save Article : {}", article);
    //     // if (article.getId() != null) {
    //     //     return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new article cannot already have an ID")).body(null);
    //     // }

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

    //     Article result = articleRepository.save(article.toArticle());
    //     articleSearchRepository.save(result);
    //     return ResponseEntity.created(new URI("/api/articles/" + result.getId()))
    //         .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
    //         .body(result);
    // }

    @PostMapping("/articles")
    @Timed
    public ResponseEntity<Article> createArticle(@RequestBody Article article) throws URISyntaxException {
        log.debug("REST request to save Article : {}", article);
        // if (article.getId() != null) {
        //     return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new article cannot already have an ID")).body(null);
        // }

        // for(int i = 0; i < article.getTagList().length; i++) {
        //     String tagName = article.getTagList()[i];
        //     Tag tag = tagRepository.findOneByName(tagName);
        //     article.addTag(tagRepository.save(tag));
        // }

        // // search for tags
        // article.tagList.stream()
        //     .map(Tag::getUserId)
        //     .collect(Collectors.toList());

        // val tagList = article.tagList.map {
        //     tagRepository.findByName(it) ?: tagRepository.save(Tag(name = it))
        // }

        // val article = Article(slug = slug,
        //         author = currentUser, title = newArticle.title!!, description = newArticle.description!!,
        //         body = newArticle.body!!, tagList = tagList.toMutableList())

        article.setCreatedAt(ZonedDateTime.now());
        article.setUpdatedAt(ZonedDateTime.now());
        article.setSlug(article.getTitle().replace(' ', '_').toLowerCase());

        Article result = articleRepository.save(article);
        articleSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/articles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

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
        if (article.getId() == null) {
            return createArticle(article);
        }
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

    /**
     * GET  /articles/:id : get the "id" article.
     *
     * @param id the id of the article to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the article, or with status 404 (Not Found)
     */
    @GetMapping("/articles/{id}")
    @Timed
    public ResponseEntity<Article> getArticle(@PathVariable Long id) {
        log.debug("REST request to get Article : {}", id);
        Article article = articleRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(article));
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

}
