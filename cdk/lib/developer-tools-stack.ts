import cdk = require('@aws-cdk/core');
import codecommit = require('@aws-cdk/aws-codecommit');

export class DeveloperToolsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string) {
      super(scope, id);
    // The code that defines your stack goes here
      const cdkRepository = new codecommit.Repository(this, "CDKRepository", {
          repositoryName: cdk.Aws.ACCOUNT_ID + "-MythicalMysfitsService-Repository-CDK"
      });

      const webRepository = new codecommit.Repository(this, "WebRepository", {
          repositoryName: cdk.Aws.ACCOUNT_ID + "-MythicalMysfitsService-Repository-Web"
      });

      this.apiRepository = new codecommit.Repository(this, "APIRepository", {
          repositoryName: cdk.Aws.ACCOUNT_ID + "-MythicalMysfitsService-Repository-API"
      });

      this.lambdaRepository = new codecommit.Repository(this, "LambdaRepository", {
          repositoryName: cdk.Aws.ACCOUNT_ID + "-MythicalMysfitsService-Repository-Lambda"
      });
  }
}