package com.example.studentapi.repository;

import com.example.studentapi.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    List<Student> findByCourseIgnoreCase(String course);

    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.firstName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.lastName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Student> search(@Param("q") String query);
}
