package com.snumart.supermarket.supermarket.repository;

import com.snumart.supermarket.supermarket.model.Customer;
import com.snumart.supermarket.supermarket.model.Sale;
import com.snumart.supermarket.supermarket.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByCustomer(Customer customer);
    List<Sale> findByEmployee(User employee);
    List<Sale> findByDateBetween(Date startDate, Date endDate);
}
