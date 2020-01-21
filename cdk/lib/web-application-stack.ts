import cdk = require('@aws-cdk/core');
import path = require('path');
import s3 = require('@aws-cdk/aws-s3');
import cloudfront = require('@aws-cdk/aws-cloudfront');
import iam = require('@aws-cdk/aws-iam');
import s3deploy = require('@aws-cdk/aws-s3-deployment');

export class WebApplicationStack extends cdk.Stack {
    constructor(app: cdk.App, id: string) {
        super(app, id);

        // The code that defines your stack goes here
        const webAppRoot = path.resolve(__dirname, '..', '..', 'frontend', 'dist');

        const bucket = new s3.Bucket(this, "Bucket", {
            websiteIndexDocument: "index.html"
        });


        // Obtain the cloudfront origin access identity so that the s3 bucket may be restricted to it.
        const origin = new cloudfront.OriginAccessIdentity(this, "BucketOrigin", {
            comment: "mythical-mysfits"
        });

        // Restrict the S3 bucket via a bucket policy that only allows our CloudFront distribution
        bucket.grantRead(new iam.CanonicalUserPrincipal(
            origin.cloudFrontOriginAccessIdentityS3CanonicalUserId
        ));


        const cdn = new cloudfront.CloudFrontWebDistribution(this, "CloudFront", {
            viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
            priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
            originConfigs: [
                {
                    behaviors: [
                        {
                            isDefaultBehavior: true,
                            maxTtl: undefined,
                            allowedMethods:
                                cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS
                        }
                    ],
                    originPath: `/web`,
                    s3OriginSource: {
                        s3BucketSource: bucket,
                        originAccessIdentity: origin
                    }
                }
            ]
        });


        new s3deploy.BucketDeployment(this, "DeployWebsite", {
            sources: [s3deploy.Source.asset(webAppRoot)],
            destinationKeyPrefix: "web/",
            destinationBucket: bucket,
            distribution: cdn,
            retainOnDelete: false
        });


        new cdk.CfnOutput(this, "CloudFrontURL", {
            description: "The CloudFront distribution URL",
            value: "https://" + cdn.domainName
        });
    }
}