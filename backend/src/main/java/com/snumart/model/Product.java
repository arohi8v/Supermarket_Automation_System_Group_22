package com.snumart.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import jakarta.persistence.*;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    private String id;
    private String name;
    private double price;
    private String category;
    private String description;
    private double discount;
}
