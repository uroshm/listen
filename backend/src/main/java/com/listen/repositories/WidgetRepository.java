package com.listen.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.listen.data.Widget;

@Repository
public interface WidgetRepository extends JpaRepository<Widget, Long> {
    
}
