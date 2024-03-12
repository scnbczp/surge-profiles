/********************************
Membership unlock for VSCO & 1Blocker & HTTPBot
********************************/

const out = {};
const ua = typeof $request != "undefined" && $request.headers ? ($request.headers['User-Agent'] || $request.headers['user-agent']) : "";

const subscription_list = {
    //'VSCO': { name: 'membership', id: 'com.circles.fin.premium.yearly' },
    'VSCO': { name: 'pro', id: 'vscopro_global_5999_annual_7D_free' },
    '1Blocker': { name: 'premium', id: 'blocker.ios.subscription.yearly' },
    'HTTPBot': { name: 'rc_lifetime', id: 'com.behindtechlines.HTTPBot.prounlock' }
};
const subscription_data = {
    "expires_date": "2099-09-09T09:09:09Z",
    "original_purchase_date": "2024-03-01T09:09:09Z",
    "purchase_date": "2024-03-01T09:09:09Z"
};

if (typeof $response == "undefined") {
    // prevent 304 issues
    delete $request.headers["x-revenuecat-etag"];
    delete $request.headers["X-RevenueCat-ETag"];
    out.headers = $request.headers;
} else {
    const resp_body = JSON.parse($response.body || null);
    if (resp_body && resp_body.subscriber) {
        resp_body.subscriber.subscriptions = resp_body.subscriber.subscriptions || {};
        resp_body.subscriber.entitlement = resp_body.subscriber.entitlement || {};
        for (const app in subscription_list) {
            if (new RegExp(`^${app}`, `i`).test(ua)) {
                resp_body.subscriber.subscriptions[subscription_list[app].id] = subscription_data;
                resp_body.subscriber.entitlements[subscription_list[app].name] = JSON.parse(JSON.stringify(subscription_data));
                resp_body.subscriber.entitlements[subscription_list[app].name].product_identifier = subscription_list[app].id;
                break;
            }
        }
        out.body = JSON.stringify(resp_body);
    }
}

$done(out);
