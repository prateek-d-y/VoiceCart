package com.voicecart.repository;

import com.voicecart.model.CallLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CallLogRepository extends JpaRepository<CallLog, Long> {
    Optional<CallLog> findByCallSid(String callSid);

    @Query("SELECT c FROM CallLog c WHERE c.status IN ('RINGING', 'IN_PROGRESS') ORDER BY c.startedAt DESC")
    List<CallLog> findActiveCalls();
}
