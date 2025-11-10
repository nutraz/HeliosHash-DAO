allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

// Use standard Gradle build directories to keep Flutter tooling compatible.
tasks.register<Delete>("clean") {
    delete(rootProject.buildDir)
}
