package org.folio.fqm.exception;

import org.folio.fqm.domain.dto.Error;
import org.folio.fqm.domain.dto.Parameter;
import org.springframework.http.HttpStatus;

import java.util.Map;

public class InvalidFqlException extends RuntimeException {

  private final String fqlQuery;
  private final Map<String, String> errors;

  public InvalidFqlException(String fqlQuery, Map<String, String> errors) {
    this.fqlQuery = fqlQuery;
    this.errors = errors;
  }

  public HttpStatus getHttpStatus() {
    return HttpStatus.BAD_REQUEST;
  }

  public Error getError() {
    Error error = new Error().message("FQL Query " + fqlQuery + " is invalid");
    errors.forEach((key, value) -> error.addParametersItem(new Parameter().key(key).value(value)));
    return error;
  }
}
