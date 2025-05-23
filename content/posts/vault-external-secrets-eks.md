---
title: 'Configuring Hashicorp Vault with External Secrets on AWS EKS'
date: '2023-05-22T00:00:00.000Z'
excerpt: 'Notes for configuring hashicorp vault with the external-secrets operator on AWS EKS'
coverImage: '/heart-lock.jpg?height=600&width=1200&text=Lock'
---

# Configuring Hashicorp Vault with External Secrets on AWS EKS

The external secrets operator is an excellent tool for connecting secrets in various secret providers to kubernetes clusters to be used by applications. Hashicorp Vault is a very common secret provider, but it can be quite complicated to configure and operate due to the number of options available.

This guide shows a configuration for using Hashicorp Vault and external-secrets operator with both tools colocated in the same cluster.

## Prerequisites

- Hashicorp Vault should be installed in the EKS cluster
- A functional Terraform setup with connections to both AWS and Vault

These will not be covered in this guide.

## Installing the External Secrets Operator

I don't generally like installing things with Helm itself - I prefer to template things.

1. Create the namespace:
    ```
    kubectl create namespace external-secrets --dry-run=client -o yaml | kubectl apply -f -
    ```
2. Install external-secrets:
    ```
    helm template external-secrets external-secrets/external-secrets --namespace external-secrets | kubectl apply -f -
    ```

## Configuring Hashicorp Vault for Kubernetes Auth with an EKS cluster (Terraform)

1. Lookup the details for your EKS cluster:
    ```
    # lookup the details for your EKS cluster
    data "aws_eks_cluster" "my-cluster" {
      name = "my-cluster"
    }
    ```
2. Mount the kubernetes backend on the "my-cluster" mount path. This is useful if you'd like to support multiple kubernetes clusters in vault. If you just need to support a single cluster, remove the "path" parameter
    ```
    resource "vault_auth_backend" "my-cluster" {
      type = "kubernetes"
      path = "my-cluster"
    }
    ```
3. Configure the k8s backend with the details to connect to the k8s cluster. Note that because EKS does not use public certs, you must provide a CA to allow Vault to connect to the cluster:
    ```
    resource "vault_kubernetes_auth_backend_config" "my-cluster" {
      backend            = vault_auth_backend.my-cluster.path
      kubernetes_host    = "https://kubernetes.default.svc.cluster.local"
      kubernetes_ca_cert = base64decode(data.aws_eks_cluster.my-cluster.certificate_authority[0].data)
    }
    ```

## Configuring a Policy and Role for the External Secrets Operator

1. Create a policy to allow the external secrets operator to read secrets from Vault:
    ```
    resource "vault_policy" "external-secrets" {
      name = "external-secrets"

      policy = <<EOT
    path "secret/my_app" {
      capabilities = ["update"]
    }
    EOT
    }
    ```
2. Create a Vault role using the kubernetes auth method. This role restricts usage to the "external-secrets" service account and namespace, and binds the "external-secrets" policy we created earlier to the role.
    ```
    resource "vault_kubernetes_auth_backend_role" "external-secrets" {
      backend                          = "my-cluster"
      role_name                        = "external-secrets"
      bound_service_account_names      = ["external-secrets"]
      bound_service_account_namespaces = ["external-secrets"]
      token_ttl                        = 3600
      token_policies                   = ["default", "external-secrets"]
    }
    ```

## Configuring a ClusterSecretStore (or SecretStore)

At this point, we should be able to test things out in our cluster. Let's create an ClusterSecretStore to map our "external-secrets" Vault role on the "my-cluster" mount path into the external secrets operator. If things work correctly, we should see the status of "Valid" and ready is "True". If this doesn't work, use the external secrets operator logs to troubleshoot what might not be working.
```
apiVersion: external-secrets.io/v1beta1
kind: ClusterSecretStore
metadata:
  name: vault
spec:
  provider:
    vault:
      server: "https://vault.mydomain.com"
      path: "kv"
      version: "v2"
      auth:
        kubernetes:
          mountPath: "my-cluster"
          role: "external-secrets"
          serviceAccountRef:
            name: "external-secrets"
            namespace: "external-secrets"
```

## Configuring an ExternalSecret

Configure an external secret to sync a secret from Vault into our target namespace. This allows us to see if the external secrets operator is configured correctly.
```
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: test
spec:
  refreshInterval: "1h"
  secretStoreRef:
    name: vault
    kind: ClusterSecretStore
  target:
    name: test
  data:
  - secretKey: test
    remoteRef:
      key: kv/foo
      property: bar
```
