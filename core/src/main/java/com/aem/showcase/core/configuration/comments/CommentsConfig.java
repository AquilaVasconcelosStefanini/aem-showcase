package com.aem.showcase.core.configuration.comments;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Generic Config Properties", 
 description = "Generic Config Properties configured per environment")
public @interface CommentsConfig {
    @AttributeDefinition(name = "Session User Name",
        description = "user name of the user you created to CRUD operations on comments functionallity, keep in mind this user must have appropriate privileges")
    String sessionUserName();

    @AttributeDefinition(name = "Session User Password",
        description = "password of the user you created to CRUD operations on comments functionallity, keep in mind this user must have appropriate privileges")
    String sessionUserPass();
}
