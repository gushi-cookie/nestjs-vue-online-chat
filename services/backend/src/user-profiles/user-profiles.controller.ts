import { Body, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, Post, Req, Res, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChangePfpDto } from './dto/change-pfp.dto';
import { DeletePfpDto } from './dto/delete-pfp.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthenticatedRequest } from 'src/auth/auth.interface';
import { UsersService } from 'src/users/users.service';
import { UserProfilesService } from './user-profiles.service';
import { Response } from 'express';


const parseFilePipe = new ParseFilePipe({
    // TO-DO maxSize should be loaded from config.
    validators: [new MaxFileSizeValidator({ maxSize: Math.pow(1000, 2) * 10 })]
});



@Controller('profile')
export class UserProfilesController {
    constructor(
        private profilesService: UserProfilesService,
        private userService: UsersService,
    ) {}


    @Post('change-pfp')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    async changePfp(
        @Req() request: AuthenticatedRequest,
        @Body() data: ChangePfpDto,
        @UploadedFile(parseFilePipe) file: Express.Multer.File
    ) {
        let payload = request.payload;
        let user = await this.userService.findOneById(payload.sub);
        if(!user) throw new UnauthorizedException();

        if(data.userId && data.userId !== payload.sub) {
            // TO-DO role check.
            throw new UnauthorizedException();
        }
        

        let profile;
        if(data.userId) {
            profile = await this.profilesService.findProfile(data.userId, false);
        } else {
            profile = await this.profilesService.findProfile(payload.sub, false);
        }
        if(!profile) throw new InternalServerErrorException();

        profile.profilePictureId = await this.profilesService.uploadPfp(file);
        await profile.save();

        return profile.profilePictureId;
    }

    @Post('delete-pfp')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async deletePfp(
        @Req() request: AuthenticatedRequest,
        @Body() data: DeletePfpDto
    ) {
        let payload = request.payload;
        let user = await this.userService.findOneById(payload.sub);
        if(!user) throw new UnauthorizedException();

        if(data.userId && data.userId !== payload.sub) {
            // TO-DO role check.
            throw new UnauthorizedException();
        }


        let profile;
        if(data.userId) {
            profile = await this.profilesService.findProfile(data.userId, false);
        } else {
            profile = await this.profilesService.findProfile(payload.sub, false);
        }
        if(!profile) throw new InternalServerErrorException();

        profile.profilePictureId = null as any;
        await profile.save();

    }

    @Get('picture/:id/:fileName')
    async getPfp(@Res() res: Response, @Param('id') id: string, @Param('fileName') fileName: string) {
        const stream = await this.profilesService.downloadPfp(id, fileName);
        if(!stream) throw new NotFoundException('File not found.');
        stream.pipe(res);
    }
}