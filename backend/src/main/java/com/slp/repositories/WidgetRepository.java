package com.slp.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.slp.entities.Widget;

@Repository
public interface WidgetRepository extends JpaRepository<Widget, Long> {
    
}
