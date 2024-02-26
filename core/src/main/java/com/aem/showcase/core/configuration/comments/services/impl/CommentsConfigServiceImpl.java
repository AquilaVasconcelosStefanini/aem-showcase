package com.aem.showcase.core.configuration.comments.services.impl;

import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;

import com.aem.showcase.core.configuration.comments.CommentsConfig;
import com.aem.showcase.core.configuration.comments.services.CommentsConfigService;

@Component(service = CommentsConfigService.class, 
    immediate = true, 
    enabled = true, 
    property = {
        Constants.SERVICE_DESCRIPTION + "=Config to grab username and pass for a valid user able to CRUD opertaions in comments node",
        Constants.SERVICE_VENDOR + "=AEMShowcase" 
    }
)
@Designate(ocd = CommentsConfig.class)
public class CommentsConfigServiceImpl implements CommentsConfigService {

    CommentsConfig config;

    @Activate
    protected final void activate(final CommentsConfig config) {
        this.config = config;
    }

    @Override
    public String getSessionUserName() {
        return config.sessionUserName();
    }

    @Override
    public String getSessionUserPass() {
        return config.sessionUserName();
    }
       
}
