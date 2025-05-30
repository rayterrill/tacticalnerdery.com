---
title: 'Configuring an Azure AD/Entra App Proxy Wildcard App'
date: '2025-05-29T00:00:00.000Z'
excerpt: 'Notes for configuring an Azure AD/Entra App Proxy Wildcard App'
coverImage: 'https://www.rayterrill.com/tacticalnerdery.com/heart-lock.jpg?height=600&width=1200&text=Lock'
---

# Configuring an Azure AD/Entra App Proxy Wildcard App

Azure AD/Entra App Proxy is a fantastic tool to provide secure remote access to private applications hosted either on-prem or in the cloud. These applications can either leverage Azure AD/Entra auth (preauthentication) or just let all traffic through (passthrough).

For most simple apps, the App Proxy works great. App Proxy doesn't work though on complex sites like SPAs that make AJAX calls to other origins, including origins on the same domain, since App Proxy blocks those requests. Azure calls these ["complex applications"](https://learn.microsoft.com/en-us/entra/identity/app-proxy/application-proxy-configure-complex-application).

Another common problem is that a client must get an access token for each Microsoft Entra application proxy app they access, which can quickly become frustrating.

The answer for complex applications is [Wildcard Applications](https://learn.microsoft.com/en-us/entra/identity/app-proxy/application-proxy-wildcard#create-a-wildcard-application) with [Application Segments](https://learn.microsoft.com/en-us/entra/identity/app-proxy/application-proxy-configure-complex-application). Wildcard Applications alone allow you to publish many applications using the same App Proxy configuration - this greatly simplifies publishing many applications that all share a common set of App Proxy properties. When coupled with App Segments, you can control how preauthentication applies to each of the applications, including managing settings like CORS rules.

Note that "normal" App Proxy applications take precedence over wildcard applications, so you can for example create a generic wildcard app for a domain, while still creating more specific App Proxy configurations for subdomains on that domain with different settings (higher auth levels, etc).

## Building a Wildcard Application

1. Create a new wildcard applications where the internal and external urls contain a wildcard, for example https://*.mydomain.com. More details are located [here](https://learn.microsoft.com/en-us/entra/identity/app-proxy/application-proxy-wildcard#scenario-1-general-wildcard-application).
2. Once the wildcard application is created, you need to configure DNS to send traffic to the wildcard app. Note that you've got a couple of options here. Note that in both cases you want to CNAME things over to the hostname `<your tenant id>.tenant.runtime.msappproxy.net`
  * Route all traffic to the wildcard app. This is the best practice and works well when you don't want to individually configure each application in DNS. See [this section](https://learn.microsoft.com/en-us/entra/identity/app-proxy/application-proxy-wildcard#domain-name-system-dns-updates) for details.
  * Route only specific subdomains to the wildcard app. This works well when you want to specifically control which applications use the App Proxy, especially if you have other applications on the same domain. See [this section](https://learn.microsoft.com/en-us/entra/identity/app-proxy/application-proxy-wildcard#excluding-applications-from-the-wildcard) for more details. If you choose this options, you must also create a second DNS entry pointing <application id>.<yourdomain>.com to the hostname `<your tenant id>.tenant.runtime.msappproxy.net`
3. Once your wildcard app has been created, within the App Proxy config you should see a new link "Add application segments" - note that this only becomes usable on wildcard apps.
4. Create an App Segment for each application within the wildcard app (for example, app1.mydomain.com and app2.mydomain.com).
  * When defining an app segment, you also have the ability to configure CORS rules - this is very helpful when you have apps that make CORS requests to other apps within the same complex application. Note that after a lot of troubleshooting, I had to ensure that any CORS requests included credentials - this is potentially because of how App Proxy handles tokens. An example config would be allowing a frontend application to make CORS requests to a backend application - a potential configuration for this would be like the following:

    | Setting | Value |
    | ------- | ----- |
    | Allowed origins | https://frontend.mydomain.com |
    | Allowed methods | OPTIONS,GET |
    | Allowed headers | * |
    | Max Age | 300 |
    | Resource | /someimportantfile/ |

6. At this point, you should be able to leverage your complex application.
