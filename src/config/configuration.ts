import { Transport } from '@nestjs/microservices';
import { join } from 'path';

const PACKAGE_NAMES = {
  USER_PACKAGE: {
    name: 'USER_PACKAGE',
    packageName: 'UserService',
    package: 'userService',
  },
  REQUEST_PACKAGE: {
    name: 'REQUEST_PACKAGE',
    packageName: 'RequestService',
    package: 'requestService',
  },
  DEAL_PACKAGE: {
    name: 'DEAL_PACKAGE',
    packageName: 'DealService',
    package: 'dealService',
  },
  PRODUCT_PACKAGE: {
    name: 'PRODUCT_PACKAGE',
    packageName: 'ProductService',
    package: 'productService',
  },
  NOTIFICATION_PACKAGE: {
    name: 'NOTIFICATION_PACKAGE',
    packageName: 'NotificationService',
    package: 'notificationService',
  },
  FEEDBACK_PACKAGE: {
    name: 'FEEDBACK_PACKAGE',
    packageName: 'FeedbackService',
    package: 'feedbackService',
  },
  REPORT_PACKAGE: {
    name: 'REPORT_PACKAGE',
    packageName: 'ReportService',
    package: 'reportService',
  },
};

const getClients = (): any => [
  {
    name: PACKAGE_NAMES.USER_PACKAGE.name,
    transport: Transport.GRPC,
    options: {
      package: PACKAGE_NAMES.USER_PACKAGE.package,
      protoPath: [
        join(process.cwd(), 'src/protos/user-service/user.proto'),
        join(process.cwd(), 'src/protos/user-service/error.proto'),
      ],
      url: `${process.env.USER_SERVICE_HOST}:${process.env.USER_SERVICE_PORT}`,
    },
  },
  {
    name: PACKAGE_NAMES.NOTIFICATION_PACKAGE.name,
    transport: Transport.GRPC,
    options: {
      package: PACKAGE_NAMES.NOTIFICATION_PACKAGE.package,
      protoPath: [
        join(
          process.cwd(),
          'src/protos/notification-service/notification.proto',
        ),
        join(process.cwd(), 'src/protos/notification-service/error.proto'),
      ],
      url: `${process.env.NOTIFICATION_SERVICE_HOST}:${process.env.NOTIFICATION_SERVICE_PORT}`,
    },
  },
  {
    name: PACKAGE_NAMES.DEAL_PACKAGE.name,
    transport: Transport.GRPC,
    options: {
      package: PACKAGE_NAMES.DEAL_PACKAGE.package,
      protoPath: [
        join(process.cwd(), 'src/protos/deal-service/deal.proto'),
        join(process.cwd(), 'src/protos/deal-service/error.proto'),
      ],
      url: `${process.env.DEAL_SERVICE_HOST}:${process.env.DEAL_SERVICE_PORT}`,
      loader: {
        enums: String,
      },
    },
  },
  {
    name: PACKAGE_NAMES.REQUEST_PACKAGE.name,
    transport: Transport.GRPC,
    options: {
      package: PACKAGE_NAMES.REQUEST_PACKAGE.package,
      protoPath: [
        join(process.cwd(), 'src/protos/request-service/request.proto'),
        join(process.cwd(), 'src/protos/request-service/error.proto'),
      ],
      url: `${process.env.REQUEST_SERVICE_HOST}:${process.env.REQUEST_SERVICE_PORT}`,
      loader: {
        enums: String,
      },
    },
  },
  {
    name: PACKAGE_NAMES.PRODUCT_PACKAGE.name,
    transport: Transport.GRPC,
    options: {
      package: PACKAGE_NAMES.PRODUCT_PACKAGE.package,
      protoPath: [
        join(process.cwd(), 'src/protos/product-service/product.proto'),
        join(process.cwd(), 'src/protos/product-service/error.proto'),
      ],
      url: `${process.env.PRODUCT_SERVICE_HOST}:${process.env.PRODUCT_SERVICE_PORT}`,
    },
  },
  {
    name: PACKAGE_NAMES.FEEDBACK_PACKAGE.name,
    transport: Transport.GRPC,
    options: {
      package: PACKAGE_NAMES.FEEDBACK_PACKAGE.package,
      protoPath: [
        join(process.cwd(), 'src/protos/feedback-service/feedback.proto'),
        join(process.cwd(), 'src/protos/feedback-service/error.proto'),
      ],
      url: `${process.env.FEEDBACK_SERVICE_HOST}:${process.env.FEEDBACK_SERVICE_PORT}`,
    },
  },
  {
    name: PACKAGE_NAMES.REPORT_PACKAGE.name,
    transport: Transport.GRPC,
    options: {
      package: PACKAGE_NAMES.REPORT_PACKAGE.package,
      protoPath: [
        join(process.cwd(), 'src/protos/report-service/report.proto'),
        join(process.cwd(), 'src/protos/report-service/error.proto'),
      ],
      url: `${process.env.REPORT_SERVICE_HOST}:${process.env.REPORT_SERVICE_PORT}`,
    },
  },
];

const getAMQPOptions = () => {
  const exchanges = {
    events: {
      name: 'events',
      type: 'topic',
    },
  };
  const username = process.env.RABBITMQ_DEFAULT_USER;
  const password = process.env.RABBITMQ_DEFAULT_PASS;
  const hostname = process.env.RABBITMQ_HOST;
  const port = parseInt(process.env.RABBITMQ_PORT, 10);
  return {
    name: process.env.RABBITMQ_NAME,
    hostname,
    port,
    username,
    password,
    exchanges,
    config: {
      exchanges: [exchanges.events],
      uri: `amqp://${username}:${password}@${hostname}:${port}`,
      connectionInitOptions: { wait: false },
    },
  };
};

export default () => ({
  applicationName: process.env.APPLICATION_NAME,
  allowedOrigins: [process.env.DASHBOARD_URL, 'http://localhost:3000'],
  authUrl: process.env.AUTH_SERVICE_URL,
  packageNames: PACKAGE_NAMES,
  clients: getClients(),
  apolloKey: process.env.APOLLO_KEY,
  apolloGraphRef: process.env.APOLLO_GRAPH_REF,
  apolloSchemaReporting: process.env.APOLLO_SCHEMA_REPORTING,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  amqp: getAMQPOptions(),
  cookieDomain: process.env.COOKIE_DOMAIN,
  webServerName: process.env.WEB_SERVER_NAME,
  minioEndpoint: process.env.MINIO_ENDPOINT || 'minio-server',
  minioServerApiPort: process.env.MINIO_SERVER_API_PORT || 9000,
  minioAccessKey: process.env.MINIO_ACCESSKEY || 'DSAHBdjjnDWIQWOWIJE',
  minioSecretKey: process.env.MINIO_SECRETKEY || 'KJDNSAJMokmdjmsass',
  googleCaptchaSecretKey: process.env.AUTH_SERVICE_DEV_CAPTCHA_KEY,
  googleCaptchaUrl: process.env.AUTH_GOOGLE_CAPTCHA_URL,
});
