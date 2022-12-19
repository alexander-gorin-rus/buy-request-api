import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UnregisteredUserGuard } from '../../common/guards/unregistered-user-guard/unregistered-user-guard';
import { ICreateTagResponse, ITag } from './interface/tag.interface';
import { GetTagsInput, Tag } from './models/tag.model';
import { TagService } from './tag.service';
import { IsSuccessResponse } from '../../common/models';
import { DataArray } from '../../common/types';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private tagService: TagService) {}

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => IsSuccessResponse)
  async createTag(
    @Args('titleRu') titleRu: string,
    @Args('titleEn') titleEn: string,
    @Args('name') name: string,
  ): Promise<ICreateTagResponse> {
    return await this.tagService.createTag(titleRu, titleEn, name);
  }

  @UseGuards(UnregisteredUserGuard)
  @Query(() => GetTagsInput, { nullable: true })
  async tags(
    @Args('tagId', { type: () => String, nullable: true }) tagId: string,
  ): Promise<DataArray<ITag>> {
    return await this.tagService.getTags(tagId);
  }
}
