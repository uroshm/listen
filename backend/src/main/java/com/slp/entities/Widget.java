package com.slp.entities;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "\"widget\"", schema = "widget_schema")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Widget {

    @Id
    private Long id;

    private String name;

    private String description;

    @Override
    public String toString(){
        return "Widget{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }

}
