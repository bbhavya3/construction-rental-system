package com.construction.equipment.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.construction.equipment.entity.Customer;
import com.construction.equipment.repository.CustomerRepository;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer addCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id).orElse(null);
    }

    public Customer updateCustomer(Long id, Customer customer) {

        Customer existingCustomer = customerRepository.findById(id).orElse(null);

        if (existingCustomer != null) {
            existingCustomer.setName(customer.getName());
            existingCustomer.setEmail(customer.getEmail());
            existingCustomer.setPhone(customer.getPhone());
            existingCustomer.setAddress(customer.getAddress());

            return customerRepository.save(existingCustomer);
        }

        return null;
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}