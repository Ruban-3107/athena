// import { hash } from 'bcrypt';
import DB from "../database/index";
import { CreateSkillSetDto } from '../dto/skill_set.dto';
import { HttpException } from '@athena/shared/exceptions';
import { SkillSet } from '../interface/skill_set.interface';
import { isEmpty } from '../util/util';

class SkillSetService {
  public skillSet = DB.DBmodels.skill_set;

  public async findAllSkillSet(): Promise<SkillSet[]> {
    const allSkillSet: SkillSet[] = await this.skillSet.findAll({});
    return allSkillSet;
  }

  public async findSkillSetById(skillSetId: number): Promise<SkillSet> {
    const findSkillSet: SkillSet = await this.skillSet.findByPk(skillSetId);
    if (!findSkillSet) throw new HttpException(409, "SkillSet doesn't exist");
    return findSkillSet;
  }

  public async  createSkillSet(skillSetData: CreateSkillSetDto): Promise<SkillSet> {
    if (isEmpty(skillSetData)) throw new HttpException(400, "skill set Data is empty");
    const findSkill: SkillSet = await this.skillSet.findOne({ where: { label: skillSetData.label } });
    if (findSkill) throw new HttpException(409, `This skill with name ${skillSetData.label} already exists`);
    const createSkillSetData: SkillSet = await this.skillSet.create({ ...skillSetData });
    return createSkillSetData;
  }

  public async updateSkillSet(skillSetId: number, skillSetData: CreateSkillSetDto): Promise<SkillSet> {
    if (isEmpty(skillSetData)) throw new HttpException(400, "SkillSet Data is empty");
    const findSkillSet: SkillSet = await this.skillSet.findByPk(skillSetId);
    if (!findSkillSet) throw new HttpException(409, "SkillSet doesn't exist");
    await this.skillSet.update({ ...skillSetData }, { where: { id: skillSetId } });
    const updateSkillSet: SkillSet = await this.skillSet.findByPk(skillSetId);
    return updateSkillSet;
  }

  public async deleteSkillSet(skillSetId: number): Promise<SkillSet> {
    if (isEmpty(skillSetId)) throw new HttpException(400, "SkillSet doesn't existId");
    const findSkillSet: SkillSet = await this.skillSet.findByPk(skillSetId);
    if (!findSkillSet) throw new HttpException(409, "SkillSet doesn't exist");
    await this.skillSet.destroy({ where: { id: skillSetId } });
    return findSkillSet;
  }
}

export default SkillSetService;
