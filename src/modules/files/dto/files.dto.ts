import { ApiProperty } from '@nestjs/swagger';

export class FileUploadInput {
  @ApiProperty({
    required: true,
    description:
      'Имя корзины в которой хранится файл и оно же имя сервиса которым пользуется пользователь',
    example: 'avatar',
  })
  bucketName: string;
}

export class FilesGetInput {
  @ApiProperty({
    required: true,
    description:
      'Имена файлов представленные как айди файлов для сервиса Минио, созданные и полученные при загрузке файла.',
    example: ['938938hewkqjbdasbdiaud.jpeg', '938938hewkqjbdasbdiaud.jpeg'],
  })
  fileNamesMinio: string;

  @ApiProperty({
    required: true,
    description:
      'Имя корзины в которой хранится файл и оно же имя сервиса которым пользуется пользователь',
    example: 'avatar',
  })
  bucketName: string;
}

export class FilesDeleteInput extends FilesGetInput {}
