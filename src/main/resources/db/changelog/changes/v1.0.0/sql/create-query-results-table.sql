-- Create the parent partitioned table
CREATE TABLE query_results
(
    result_id        UUID NOT NULL,
    query_id         UUID NOT NULL,
    PRIMARY KEY (result_id, query_id),
    CONSTRAINT fk_query_id FOREIGN KEY (query_id)
                    REFERENCES query_details (query_id) MATCH SIMPLE
) PARTITION BY HASH(query_id);

-- Script to create the child tables for each partition
CREATE TABLE query_results_00 PARTITION OF query_results FOR VALUES WITH (MODULUS 12, REMAINDER 0);
CREATE TABLE query_results_01 PARTITION OF query_results FOR VALUES WITH (MODULUS 12, REMAINDER 1);
CREATE TABLE query_results_02 PARTITION OF query_results FOR VALUES WITH (MODULUS 12, REMAINDER 2);
CREATE TABLE query_results_03 PARTITION OF query_results FOR VALUES WITH (MODULUS 12, REMAINDER 3);
CREATE TABLE query_results_04 PARTITION OF query_results FOR VALUES WITH (MODULUS 12, REMAINDER 4);
CREATE TABLE query_results_05 PARTITION OF query_results FOR VALUES WITH (MODULUS 12, REMAINDER 5);
CREATE TABLE query_results_06 PARTITION OF query_results FOR VALUES WITH (MODULUS 12, REMAINDER 6);
CREATE TABLE query_results_07 PARTITION OF query_results FOR VALUES WITH (MODULUS 12, REMAINDER 7);
CREATE TABLE query_results_08 PARTITION OF query_results FOR VALUES WITH (MODULUS 12, REMAINDER 8);
CREATE TABLE query_results_09 PARTITION OF query_results FOR VALUES WITH (MODULUS 12, REMAINDER 9);
CREATE TABLE query_results_10 PARTITION OF query_results FOR VALUES WITH (MODULUS 12, REMAINDER 10);
CREATE TABLE query_results_11 PARTITION OF query_results FOR VALUES WITH (MODULUS 12, REMAINDER 11);