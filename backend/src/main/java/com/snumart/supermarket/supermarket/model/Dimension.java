package com.snumart.supermarket.supermarket.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Dimension {

    private Integer width;
    private Integer height;

    public Dimension() {
    }

    public Dimension(Integer width, Integer height) {
        this.width = width;
        this.height = height;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }
}
