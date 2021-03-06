---
layout: page
title: Snippets
permalink: /snippets/
---

> Snippets or little things I cannot seem to remember but continue to need to get things done.

#### Adding an cluster to kubeconfig
<pre class="code">
aws eks update-kubeconfig --region [region] --name [cluster name]
</pre>
<hr />
#### Run a Ubuntu Pod in a Cluster to Debug Something
One of these days I'm gonna push an image to Dockerhub that has all the tools I need so I don't need to `apt update; apt install curl;`, etc - but that is not today. :)
<pre class="code">
kubectl run --rm -it --image=ubuntu debugme -- /bin/bash -l
</pre>
<hr />
#### Fix the Weird Terraform v0.12 Issue Where it Won't Load AWS Creds
This annoys the shit out of me and I always forget this command. :)
<pre class=code>
export AWS_SDK_LOAD_CONFIG=1
</pre>
<hr />
#### Use grep, awk, and xargs to Do Some Sketchy Stuff in a Cluster
Disclaimers: YMMV/IANAL/Don't try this at home I'm a professional :)

<pre class="code">
kubectl get po | grep Terminating | awk '{print $1}' | xargs kubectl delete po --force --grace-period=0

kubectl get po --all-namespaces | grep Terminating | awk '{print $2 " " $1}' | xargs printf 'kubectl delete po %s -n %s --force --grace-period=0\n'

kubectl get crd | grep kyverno | awk '{print $1}' | xargs kubectl delete crd
</pre>
<hr />
#### Clear the Console + Scrollback in the VS Code Console
I need to use the VSCode Console more instead of switching back/forth between the IDE and iTerm.
<pre class="code">
<kbd>CMD + K</kbd> or <kbd>CTRL + K</kbd>
</pre>
#### Add an Origin for Github
<pre class="code">
git remote add origin https://github.com/rayterrill/t.git
git branch -M main
git push -u origin main
</pre>
<hr />
#### Helm Stuff
Pull a specific chart version:
<pre class="code">
helm pull ingress-nginx/ingress-nginx --version 3.11.1
</pre>
See what versions of a chart are available:
<pre class="code">
helm search repo ingress-nginx/ingress-nginx --versions
</pre>
