# Dev Environment

- https://medium.com/@jonbaldie/how-to-connect-to-redis-with-unix-sockets-in-docker-9e94e01b7acd

# Notes

### Config notes

- use objects like this:
  {
  version: "2",
  config: ...
  }
- keep one store with schema-version records to validate config objects
  {
  version: "2",
  schema: ...
  }
