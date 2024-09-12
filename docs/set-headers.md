# Add custom headers to top-level document in directory using NGINX for BodyMaps website

1. Open your NGINX configuration file. This could be `/etc/nginx/nginx.conf` or a file in the `/etc/nginx/sites-available/` directory, depending on your setup.
2. add to an existing server block that is listening on 443 with `server_name cs.jhu.edu`

## Adding to Existing Server Block

```
server {
    listen 443 ssl;
	server_name cs.jhu.edu;

  ...

    # Add this location block
	location [route] {
        add_header Cross-Origin-Opener-Policy "same-origin";
        add_header Cross-Origin-Embedder-Policy "require-corp";
    }
...
}
```

Other server block configurations, such as setting up HTTPS, should already be done.
`server_name` should be `cs.jhu.edu`
Values to replace:

- [route] → The route to access the website is **/~zongwei/yuzhi/bodymaps-website/**
  (current full URL is https://www.cs.jhu.edu/~zongwei/yuzhi/bodymaps-website/)

3. Reload Nginx service to apply changes.
