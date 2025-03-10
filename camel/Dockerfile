FROM eclipse-temurin:17 as build
ARG USERNAME=loyaltyuser
ARG USER_UID=10014
ARG USER_GID=$USER_UID

# Create a new user with UID 10014
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME

RUN mkdir -p /workspace/app && chown -R $USERNAME /workspace/app && cd /workspace/app
WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY rest-openapi rest-openapi

RUN ./mvnw install -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../../rest-openapi/target/*.jar)

FROM eclipse-temurin:17
VOLUME /tmp
ARG DEPENDENCY=/workspace/app/target/dependency
USER 10014
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app
ENTRYPOINT ["java","-cp","app:app/lib/*","org.apache.camel.example.springboot.Application"]

ENV HOST '0.0.0.0'
EXPOSE 8080
