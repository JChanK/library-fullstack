package com.example.library.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

@Schema(description = "Book DTO")
public class BookDto {
    @Schema(description = "ID книги", example = "1")
    private int id;

    @NotBlank
    @Schema(description = "Название книги", example = "Война и мир")
    private String title;

    @NotEmpty
    @Schema(description = "Список авторов книги")
    private List<AuthorDto> authors;

    @Schema(description = "Список отзывов о книге")
    private List<ReviewDto> reviews;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<AuthorDto> getAuthors() {
        return authors;
    }

    public void setAuthors(List<AuthorDto> authors) {
        this.authors = authors;
    }

    public List<ReviewDto> getReviews() {
        return reviews;
    }

    public void setReviews(List<ReviewDto> reviews) {
        this.reviews = reviews;
    }
}